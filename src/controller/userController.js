class UserController{
    login = (token,isAdmin) => {
      localStorage.setItem('token', token);
      localStorage.setItem('isAdmin', isAdmin);
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