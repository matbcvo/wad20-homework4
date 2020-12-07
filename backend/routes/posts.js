const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const PostModel = require('../models/PostModel');


router.get('/', authorize, (request, response) => {

    // Endpoint to get posts of people that currently logged in user follows or their own posts

    PostModel.getAllForUser(request.currentUser.id, (postIds) => {

        if (postIds.length) {
            PostModel.getByIds(postIds, request.currentUser.id, (posts) => {
                response.status(201).json(posts)
            });
            return;
        }
        response.json([])

    })

});

router.post('/', authorize,  (request, response) => {

    // Endpoint to create a new post

    console.log(request.body);
    let text = request.body.text
    let mediaUrl = request.body.media.url
    let mediaType = request.body.media.type

    if (!request.body.text && !mediaUrl) {
        response.json({
            code: "missing_input",
            message: "Please provide input"
        }, 400)
        return;
    }

    if (mediaUrl && mediaType == null) {
        response.json({
            code: "missing_media_type",
            message: "Please provide media type"
        }, 400)
        return;
    }

    let params = {
        userId: request.currentUser.id,
        text: text,
        media: {
            type: mediaType,
            url: mediaUrl
        }
    };
    PostModel.create(params, () => {
        response.status(200).json([])
    })
});


router.put('/:postId/likes', authorize, (request, response) => {

    // Endpoint for current user to like a post
    userId = request.currentUser.id
    postId = request.params.postId

    PostModel.like(userId, postId, () => {
        response.status(200).send("post is liked")
    })
});

router.delete('/:postId/likes', authorize, (request, response) => {

    // Endpoint for current user to unlike a post

});

module.exports = router;
