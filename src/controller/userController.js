class UserController{
    login = (token,isAdmin,userId) => {
      localStorage.setItem('token', token);
      localStorage.setItem('isAdmin', isAdmin);
      localStorage.setItem('userId', userId);
      window.location.href = '/';
    };
      
    logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/connexion';
      };
      
    getToken = () => {
        return localStorage.getItem('token');
      };
      
    isLoggedIn = () => {
        return this.getToken() !== null;
      };
    
    getStatus = () => {
      return localStorage.getItem('isAdmin')
    }
    isAdmin = () => {
      return this.getStatus() !== 'null';
    };
}

export default UserController