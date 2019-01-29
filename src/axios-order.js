import Axios from 'axios';

const instance = Axios.create({
    baseURL: 'https://burger-builder-340a7.firebaseio.com/',
});

export default instance;