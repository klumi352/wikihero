exports.Api = {
  new: {
    /**
     * @__GROUP
     * Auth operation with move points (gamefication!)
     * If temporary user auth (log/reg) as real user
     */
    GET_ALL_GROUPS: '/groups',
    SEARCH_GROUPS: '/groups/search',
    GET_ALL_GROUPS_ADMIN: '/admin/groups',
    SET_NEW_GROUP: '/admin/groups',
    DELETE_GROUP: (GROUP_ID) => `/admin/groups/${GROUP_ID}`,
    EDIT_GROUP: (GROUP_ID) => `/admin/groups/${GROUP_ID}`,
    UPDATE_GROUP: (GROUP_ID) => `/admin/groups/update/${GROUP_ID}`,
    SUBSCRIBED_GROUPS: '/groups/subscribed-groups',
    GET_BOTH_GROUPS: '/all-groups',
    GROUP_BY_SLUG: (GROUP_SLUG) => `/groups/${GROUP_SLUG}`,
    TOGGLE_SUBSCRIBE: (GROUP_SLUG) =>
      `/groups/${GROUP_SLUG}/toggleSubscription`,
    GROUP_BY_TOPIC: (TOPIC_SLUG) => `/groups/list-by-topic/${TOPIC_SLUG}`,
    /**
     * @__CATEGORY
     * Auth operation with move points (gamefication!)
     * If temporary user auth (log/reg) as real user
     */
    SET_NEW_CATEGORY: '/admin/group-category',
    GET_ALL_CATEGORIES_ADMIN: '/admin/group-category',
    GET_ALL_CATEGORIES: '/admin/group-category', // was edited from '/group-category'
    GET_ALL_CATEGORIES_SEARCH: '/group-category',
    GET_ALL_CATEGORIES_CLIENT: '/group-category',
    GET_CATEGORIES_BY_GROUP: (CATEGORY_ID) =>
      `/group-category-by-group/${CATEGORY_ID}`,
    DELETE_CATEGORY: (CATEGORY_ID) => `/admin/group-category/${CATEGORY_ID}`,
    EDIT_CATEGORY: (CATEGORY_ID) => `/admin/group-category/${CATEGORY_ID}`,
    GET_ALL_CATEGORIES_BY_GROUP: (GROUIP_ID) =>
      `/group-category-by-group/${GROUIP_ID}`,
    /**
     * @__HASHTAGS
     * Auth operation with move points (gamefication!)
     * If temporary user auth (log/reg) as real user
     */
    GET_ALL_HASHTAGS_ADMIN: '/admin/hashtags',
    SET_NEW_HASHTAG: '/admin/hashtags',
    EDIT_HASHTAG: (HASHTAG_ID) => `/admin/hashtags/${HASHTAG_ID}`,
    DELETE_HASHTAG: (HASHTAG_ID) => `/admin/hashtags/${HASHTAG_ID}`,
    SET_NEW_SENIORITY: '/admin/seniorities',
    EDIT_SENIORITY: (SENIORITY_ID) => `/admin/seniorities/${SENIORITY_ID}`,
    DELETE_SENIORITY: (SENIORITY_ID) => `/admin/seniorities/${SENIORITY_ID}`,
    SEARCH_HASHTAG: '/hashtags?search-result=',
    FILTER_HASHTAGS: '/hashtags/list-filter',
    /**
     * @__POST
     * Auth operation with move points (gamefication!)
     * If temporary user auth (log/reg) as real user
     */
    EDIT_POST: (POST_ID) => `/admin/posts/${POST_ID}`,
    UPDATE_POST: (POST_ID) => `/admin/posts/${POST_ID}`,
    DELETE_POST: (POST_ID) => `/admin/posts/${POST_ID}`,
    PUBLISH_POST: (POST_ID) => `/admin/posts/${POST_ID}/toggle-active`,
    GET_ALL_POSTS: '/posts/search',
    POST_BY_SLUG: (POST_SLUG) => `/posts/${POST_SLUG}`,
    POST_REACT: (ID_VALUE) => `/posts/${ID_VALUE}/react`,
    PROFILE_POST_LIST: '/user/profile/posts',
    APPROVE_POST: (POST_ID) => `/admin/posts/notification/${POST_ID}/approve`,
    /**
     * @__MENU
     * Auth operation with move points (gamefication!)
     * If temporary user auth (log/reg) as real user
     */
    MENU_GET: '/groups',
    /**
     * @__FILTER
     * Auth operation with move points (gamefication!)
     * If temporary user auth (log/reg) as real user
     */
    FILTER: '/hashtags/list-filter',
    /**
     * @__COMMENTS
     * Auth operation with move points (gamefication!)
     * If temporary user auth (log/reg) as real user
     */
    CREATE_COMMENT_BY_ID: (ID_VALUE) => `/post/${ID_VALUE}/comments`,
    GET_COMMENTS_LIST_BY_ID: (ID_VALUE) => `/post/${ID_VALUE}/comments`,
    GET_THREAD_LIST_BY_ID: (ID_VALUE) => `/show-thread/${ID_VALUE}`,
    SEARCH_COMMENTS: '/comments/search',
    GET_ALL_COMMENTS_ADMIN: '/comments/all',
    GET_COMMENT_BY_ID: (ID_VALUE) => `/comments/${ID_VALUE}/get`,
    SET_EDITED_COMMENT_BY_ID: (ID_VALUE) => `/comments/${ID_VALUE}/edit`,
    DELETE_COMMENT_BY_ID: (ID_VALUE) => `/comments/${ID_VALUE}`,
    PROFILE_COMMENT_LIST: '/user/profile/comments',
    COMMENT_NOTIFICATION: '/comments/notification',
    APPROVE_COMMENT: (COMMENT_ID) =>
      `/comments/notification/${COMMENT_ID}/approve`,
    /**
     * @__FEED
     */
    FEED_FOR_THIS_WEEK: '/posts/for-this-week',
    FEED_FOR_LAST_WEEK: '/posts/for-last-week',
    FEED_FOR_REST_OF_MONTH: '/posts/for-rest-month',
    /**
     * @_SEARCH
     */
    POST_SEARCH_CONTENT: '/posts/search',
    COMMENT_SEARCH_CONTENT: '/comments/search',
    GROUP_SEARCH_CONTENT: '/groups/search',
    HASHTAG_SEARCH_CONTENT: '/hashtags/search-filter',
    /**
     * @_SEARCH_DROPDOWN_API
     */
    CATEGORY_BY_GROUP_ID: (ID) => `/group-category-by-group/${ID}`,
    CATEGORY_LIST: '/group-category',
    HASHTAG_LIST: '/hashtags/filter',
    GROUP_LIST: '/groups'
  },
  client: {
    /**
     * @__AUTH
     * Auth operation with move points (gamefication!)
     * If temporary user auth (log/reg) as real user
     */
    AUTH_ME: `/me`,
    LOGIN_LOCAL: `/login/user/with/move/points`,
    LOGIN_FACEBOOK: `/login/facebook`,
    LOGIN_GOOGLE: `/login/google`,
    REGISTRATION: `/registration/user`,
    CTEARE_TEMP_USER: `/temp/user`,
    SIGN_UP_VALIDATION: `/registration/user/step-one-validation`,
    SIGN_UP_STEP_TWO_VALIDATION: `/registration/user/step-two-validation`,
    SENIORITIES: `/seniorities`,

    /**
     * @__COMMON
     */
    /** COMBINE_SLUG => ${topic-slug}/?{subtopic-slug} */
    MENU_GET: (COMBINE_SLUG = '') => `/menu/${COMBINE_SLUG}`,
    REGISTER_VIEW_FROM_SEARCH: `/successful/search`,
    RESOURCES_UPLOAD: `/uploads`,

    /**
     * @__FEED
     */
    FEED_TIP_ALL: `/whats-new/tips`,
    FEED_TOPIC_ALL: `/whats-new/topics`,
    FEED_COUNTS: `/whats-new/items-count`,
    MISSED_POSTS: `/missed-posts`,
    LAST_VISIT_DATE: `/set-last-visit-date`,

    /**
     * @__MODALS
     * Post request from modal
     */
    TIP_ATTACH_COMMENT: (TIP_ID) => `/register/user/comment/tip/${TIP_ID}`,
    FORGOT_SENT_LINK: `/forget-password/generate/link`,
    TIP_LINK_CONTRIBUTE: `/contribute-link`,
    MODERATOR_REQUEST: `/become/moderator`,
    TOPIC_CONTRIBUTE: `/contribute/topic`,
    OFFER_CONTRIBUTE: `/user/looking-for`,
    PASSWORD_RESET: `/reset-password`,
    PROFILE_VERIFY: `/verify/profile`,
    USER_SETTING: `/user/settings`,
    TIP_VALIDATION: `/worked/tip`,
    EMAIL_VERIFY: `/verify/email`,
    TIP_CONTRIBUTE: `/user/tip`,
    TIP_FLAG: `/user/flag/tip`,

    /**
     * @__TOPIC
     */
    /** COMBINE_SLUG => ${topic-slug}/?{subtopic-slug} */
    ALL_TOPICS: '/topics',
    TOPIC_CREATE: `/topic`,
    TOPIC: (COMBINE_SLUG) => `/topic/${COMBINE_SLUG}`,
    TOPIC_OVERALL_ALL: `/topics/overall`,
    TOPIC_SUBSCRIBE: `/subscribe-topic`,
    TOPIC_UNSUBSCRIBE: (TOPIC_ID) => `/unsubscribe-topic/${TOPIC_ID}`,

    /**
     * @__SUBTOPIC
     */
    /** COMBINE_SLUG => ${topic-slug}/${subtopic-slug} */
    SUBTOPIC_NESTED_ALL: (COMBINE_SLUG) => `/sub/topics/${COMBINE_SLUG}`,
    /** COMBINE_SLUG => ${topic-slug}/${subtopic-slug} */
    SUBTOPIC_FILTERED_ALL: (COMBINE_SLUG) =>
      `/filter/sub/topics/${COMBINE_SLUG}`,

    /**
     * @__PROFILE
     */
    //* new url for get user info - start */
    // PROFILE_SETTING: `/user/settings`,
    PROFILE_SETTING: `/user/profile`,
    //* new url for get user info - finish */
    TIP_PROFILE_ALL: `/user/settings/tips`,
    LINK_PROFILE_ALL: `/user/settings/validation-urls`,
    TOPIC_PROFILE_ALL: `/user/settings/topics`,
    RANDOM_CONTRIBUTORS: `/user/random-contributors`,
    CLEAR_TOPIC_NOTIFICATION: (TOPIC_ID) =>
      `/remove/notification/topic/${TOPIC_ID}`,

    /**
     * @__TIP
     */
    TIP: (TIP_ID) => `/tip/${TIP_ID}`,
    TIP_SHARE: (TIP_ID) => `/tip/${TIP_ID}`,
    TIP_ALL: (TOPIC_SLUG) => `/tips/front/${TOPIC_SLUG}`,
    TIP_REGISTER_VIEW: (TIP_ID) => `/register/view/tip/${TIP_ID}`,

    /**
     * @__PAGES
     */
    PAGE: (PAGE_ID) => `/pages/${PAGE_ID}`,
    PAGE_EDIT: (PAGE_ID) => `/pages/${PAGE_ID}`,

    /**
     * @__TRANSLATION
     */
    TRANSLATION_ALL: `/translate`,

    /**
     * @__IMAGE
     */
    IMAGE_ALL: `/images/front`
  },

  admin: {
    /**
     * @__COMMON
     */
    NOTIFICATIONS_ALL: `/admin/list-notifications`,

    /**
     * @__TIP
     */
    TIP: (TIP_ID) => `/admin/tip/${TIP_ID}`,
    // TIP_CREATE: `/admin/tip`, // @deprecated
    TIP_CREATE: `/admin/tips`,
    // TIP_EDIT: (TIP_ID) => `/tip/${TIP_ID}`, // @deprecated
    TIP_EDIT: (TIP_ID) => `/admin/tips/${TIP_ID}`,
    TIP_DELETE: (TIP_ID) => `/tip/${TIP_ID}`,
    TIP_REORDER: (TIP_ID) => `/admin/reorder/tip/${TIP_ID}`,
    TIP_CONFIRM: (TIP_ID) => `/confirm/by/admin/tip/${TIP_ID}`,
    TIP_PUBLISH: (TIP_ID) => `/publish/by/admin/tip/${TIP_ID}`,

    /**
     * @__TOPIC
     */
    TOPIC: (COMBINE_SLUG) => `/admin/topic/${COMBINE_SLUG}`,
    TOPIC_CREATE: `/admin/topic`,
    TOPIC_EDIT: (TOPIC_ID) => `/admin/topic/${TOPIC_ID}`,
    TOPIC_DELETE: (TOPIC_ID) => `/topic/${TOPIC_ID}`,
    TOPIC_REORDER: (TOPIC_ID) => `/admin/reorder/topics/${TOPIC_ID}`,
    TOPIC_CONFIRM: (TOPIC_ID) => `/admin/topic/status/${TOPIC_ID}`,
    TOPIC_PUBLISH: (TOPIC_ID) => `/admin/topic/published/${TOPIC_ID}`,
    TOPIC_GRAPH_FOR_REORDER: (TOPIC_ID) => `/admin/reorder/topics/${TOPIC_ID}`,
    GET_ALL_TOPIC: 'admin/topics/overall',

    /**
     * @__TABLES
     */
    SUBTOPIC_CONTRIBUTED_ALL: `/not/confirmed/sub/topics/`,
    TIP_CONTRIBUTED_ALL: `/not/confirmed/tips`,
    LINK_SUGGESTED: `/admin/suggested/links`,
    TIP_FLAGGED_ALL: `/admin/flags/tips`,
    MODERATOR_ALL: `/admin/moderators`,
    OFFER_ALL: `/admin/user/offers`,
    SUBTOPIC_ALL: `/sub/topics/`,
    TOPIC_ALL: `/admin/topics/overall`,
    SENIORITIES_ALL: `/admin/seniorities`,
    USER_ALL: `/admin/users`,
    TIP_COMMENT_ALL: `/admin/validated/tips`,
    TIP_ALL: `/tips`,

    /**
     * @__IMAGES
     */
    IMAGE_ALL: `/images`,
    IMAGE_CREATE: `/create/images`,
    IMAGE_EDIT: (IMAGE_ID) => `/update/images/${IMAGE_ID}`,
    IMAGE_DELETE: (IMAGE_ID) => `/images/${IMAGE_ID}`,

    /**
     * @__LINK_SUGGESTED
     */
    LINK_SUGGESTED_CHANGE_STATUS: (LINK_ID) =>
      `/admin/suggested/links/status/${LINK_ID}`,
    LINK_SUGGESTED_DELETE: (LINK_ID) => `/admin/suggested/links/${LINK_ID}`,

    /**
     * @__API
     */
    API_SETTING_ALL: `/application/settings`,
    API_SETTING_EDIT: `/application/settings`,

    /**
     * @__USER
     */
    USER_TO_BAN: (USER_ID) => `/admin/add/remove/from/ban-list/user/${USER_ID}`,
    USER_DELETE: (USER_ID) => `/user/${USER_ID}`,

    /**
     * @__LEVEL
     */
    LEVEL_ALL: `levels`,
    LEVEL_EDIT: `levels`,
    LEVEL_ATTACH_IMAGE: `/levels/image`,

    /**
     * @__TRANSLATION
     */
    TRANSLATION_ALL: `/admin/translate`,
    TRANSLATION_CREATE: `/translate`,
    TRANSLATION_EDIT: (TRANS_ID) => `/translate/${TRANS_ID}`,
    TRANSLATION_DELETE: (TRANS_ID) => `/translate/${TRANS_ID}`,

    /**
     * @__STATISTIC
     */
    STATISTIC_ACTIVE_USER: `/admin/statistic/active/users`,
    STATISTIC_VALIDATED_TIP: `/admin/statistic/validated/tips`,
    STATISTIC_SEARCH: `/admin/statistic/search`
  }
}
