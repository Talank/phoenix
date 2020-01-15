<template>
  <div v-if="!loadingConfig">
    <link v-if="phoenixUrl" rel="stylesheet" :href="phoenixUrl + '/dist-wc/design-system/system.css'" />
    <oc-navbar id="oc-topbar" tag="header" class="oc-topbar uk-navbar">
      <oc-navbar-item position="left">
        <oc-button v-if="hasAppNavigation" icon="menu" variation="primary" class="oc-topbar-menu-burger uk-height-1-1" aria-label="Menu" @click="$_onOpenAppNavigation" ref="menubutton">
          <span class="oc-topbar-menu-burger-label" v-translate>Menu</span>
        </oc-button>
      </oc-navbar-item>
      <oc-navbar-item position="center">
        <router-link to="/" class="oc-topbar-icon">ownCloud X</router-link>
      </oc-navbar-item>
      <oc-navbar-item position="right" v-if="!isPublicPage">
        <notifications v-if="activeNotifications.length" />
        <applications-menu :applicationsList="$_applicationsList"/>
        <user-menu :user-id="userId" :user-display-name="userDisplayName" />
      </oc-navbar-item>
    </oc-navbar>
  </div>
</template>

<script>
// import externalComponent from '../utils/external-component.js'
import pluginHelper from '../mixins/pluginHelper.js'
import ApplicationsMenu from './ApplicationsMenu.vue'
import UserMenu from './UserMenu.vue'
import Notifications from './Notifications.vue'
// FIXME: replace with dynamic load with externalComponent()
/* eslint-disable no-unused-vars */
import DesignSystem from 'owncloud-design-system'

export default {
  components: {
    Notifications,
    ApplicationsMenu,
    UserMenu
  },
  mixins: [
    pluginHelper
  ],
  props: {
    userId: {
      type: String,
      required: false,
      default: null
    },
    userDisplayName: {
      type: String,
      required: false,
      default: null
    },
    applicationsList: {
      type: Array,
      required: false,
      default: () => []
    },
    hasAppNavigation: {
      type: Boolean,
      required: false,
      default: false
    },
    activeNotifications: {
      type: [Array, Boolean],
      required: false,
      default: () => []
    },
    phoenixUrl: {
      type: String,
      required: false
    },
    serverUrl: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      loadingConfig: true
    }
  },
  computed: {
    isPublicPage () {
      return !this.userId
    },
    $_applicationsList () {
      return this.applicationsList
    }
  },
  async beforeMount () {
    // web component mode
    if (!this.$root.config) {
      let config = {}
      // FIXME: duplicate from phoenix.js, maybe need common utility functions ?
      try {
        config = await fetch(this.phoenixUrl + '/config.json')
        config = await config.json()
        config.isWebComponent = true
        // TODO: also load capabilities...
        config.enableAvatars = true
      } catch (e) {
        config.state = 'missing'
      }
      this.$root.config = config
      // FIXME: also include apps from extension points
      if (!this.$_applicationsList || !this.$_applicationsList.length) {
        this.$_applicationsList = config.applications
      }
      // TODO: init language
      console.log('config: ', config)
      this.loadingConfig = false
    } else {
      this.loadingConfig = false
    }
  },
  methods: {
    $_onOpenAppNavigation () {
      this.$emit('toggleAppNavigation')
    }
  }
}
</script>
