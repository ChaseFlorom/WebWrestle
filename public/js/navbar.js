// public/js/navbar.js
// This file will be served as /js/navbar.js 
// (assuming app.use(express.static('public')))

const AppNavbar = {
  name: 'AppNavbar',
  data() {
    return {
      username: localStorage.getItem('username') || null
    };
  },
  computed: {
    isLoggedIn() {
      return !!this.username;
    },
    menuModel() {
      const items = [
        {
          label: 'Home',
          icon: 'pi pi-home',
          command: () => window.location.href = 'index.html'
        },
        {
          label: 'About',
          icon: 'pi pi-info-circle',
          command: () => alert('Wrestleverse - A Wrestling Roleplay Experience')
        },
        { separator: true }
      ];

      if (!this.isLoggedIn) {
        items.push(
          {
            label: 'Login',
            icon: 'pi pi-sign-in',
            command: () => window.location.href = 'login.html'
          },
          {
            label: 'Register',
            icon: 'pi pi-user-plus',
            command: () => window.location.href = 'register.html'
          }
        );
      } else {
        items.push(
          {
            label: `Hello, ${this.username}!`,
            disabled: true
          },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: this.logout
          }
        );
      }
      return items;
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = 'index.html';
    }
  },
  template: `
    <Menubar :model="menuModel" />
  `
};
