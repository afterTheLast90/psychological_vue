import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [

        {
            path: '/login',
            name: 'login',
            component: () => import("../views/Login")
        }, {
            path: '/main',
            name: 'main',
            component: () => import("../views/Main")
        }
        , {
            path: '/topBar',
            name: '/topBar',
            component: () => import("../views/TopBar"),
            children: [
                {
                    path: "administrator",
                    name: "administrator",
                    component: () => import("../views/Administrator")
                },
                {
                    path: "area",
                    name: "area",
                    component: () => import("../views/Area" )
                },
                {
                    path: "teacher",
                    name: "teacher",
                    component: () => import("../views/Teacher" )
                },
                {
                    path: "classes",
                    name: "classes",
                    component: () => import("../views/Classes" )
                },
                {
                    path: "student",
                    name: "student",
                    component: () => import("../views/Student" )
                },
                {
                    path: "questionnaire",
                    name: "questionnaire",
                    component: () => import("../views/Questionnaire" )
                },
                {
                    path: "questionnaireDetails",
                    name: "questionnaireDetails",
                    component: () => import("../views/questionnaireDetails" )
                }
            ]
        }
        , {
            path: '/mobile',
            name: 'moblie',
            component: () => import('../views/Mobile'),
            children: [
                {
                    path: "personalInformation",
                    name: "personalInformation",
                    component: () => import("../views/PersonalInformation")
                },
                {
                    path: "beFilledWith",
                    name: "beFilledWith",
                    component: () => import("../views/BeFilledWith")
                },
                {
                    path: "answerQuestionnaire",
                    name: "answerQuestionnaire",
                    component: () => import("../views/AnswerQuestionnaire")
                }
            ]
        }
    ]
;


const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
