class UserController{
    login = (token) => {
        localStorage.setItem('token', token);
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
}

export default UserController