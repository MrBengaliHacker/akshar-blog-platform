//  Node Modules
import axios from 'axios'; 

export const aksharApi = axios.create({
  baseURL: 'http://localhost:3000/api/v1'
});