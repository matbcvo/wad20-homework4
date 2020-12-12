import {mount, createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Posts from "../../src/components/Posts.vue";
import moment from 'moment'

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

//Create dummy store
const store = new Vuex.Store({
    state: {
        user: {
            id: 1,
            firstname: 'test',
            lastname: 'test',
            email: 'test',
            avatar: 'test',
        }
    },
    getters: {
        user: (state) => state.user,
    }
});

//Create dummy routes
const routes = [
    {
        path: '/',
        name: 'posts',
    },
    {
        path: '/profiles',
        name: 'profiles'
    }
];

const router = new VueRouter({routes});

const testData = [
    {
        id: 1,
        text: "I think it's going to rain",
        createTime: "2020-12-05 13:53:23",
        likes: 0,
        liked: false,
        media: {
            url: "test-image.jpg",
            type: "image"
        },
        author: {
            id: 2,
            firstname: "Gordon",
            lastname: "Freeman",
            avatar: 'avatar.url'
        }
    },
    {
        id: 2,
        text: "Which weighs more, a pound of feathers or a pound of bricks?",
        createTime: "2020-12-05 13:53:23",
        likes: 1,
        liked: true,
        media: null,
        author: {
            id: 3,
            firstname: "Sarah",
            lastname: "Connor",
            avatar: 'avatar.url'
        }
    },
    {
        id: 4,
        text: null,
        createTime: "2020-12-05 13:53:23",
        likes: 3,
        liked: false,
        media: {
            url: "test-video.mp4",
            type: "video"
        },
        author: {
            id: 5,
            firstname: "Richard",
            lastname: "Stallman",
            avatar: 'avatar.url'
        }
    }
];

//Mock axios.get method that our Component calls in mounted event
jest.mock("axios", () => ({
    get: () => Promise.resolve({
        data: testData
    })
}));

describe('Posts', () => {

    const wrapper = mount(Posts, {router, store, localVue});

    it('1 == 1', function () {
        expect(true).toBe(true)
    });

    it("renders correct amount of posts", ()=>{
        const testPostAmount = testData.length;
        const renderedAmount = wrapper.findAll('.post').length

        expect(renderedAmount).toEqual(testPostAmount)
    })

    it("post has media property, image or video tags are rendered depending on media.type property, or if media property is absent nothing is rendered", () => {
        const getMedias = wrapper.findAll(".post-image").length;
        const getTestMedias = testData.filter(testPost => testPost.media != null).length;
        expect(getMedias).toBe(getTestMedias);

        const getImages = wrapper.findAll(".post-image > img").length;
        const getTestImages = testData.filter(testPost => testPost.media != null && testPost.media.type == "image").length;
        expect(getImages).toBe(getTestImages);

        const getVideos = wrapper.findAll(".post-image > video").length;
        const getTestVideos = testData.filter(testPost => testPost.media != null && testPost.media.type == "video").length;
        expect(getVideos).toBe(getTestVideos);
    })

    it("post create time is displayed in correct date format", () => {
        const getDates = wrapper.findAll('.post-author > small');
        for (let i = 0; i < testData.length; i++) {
            const correctDateFormat = moment(testData[i].createTime).format('LLLL');
            expect(getDates.at(i).text()).toEqual(correctDateFormat);
        }
    })
});