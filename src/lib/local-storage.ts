import { Convo } from "./convo/types";

export const ls = {

  saveConvoId( convo: Convo ){
    localStorage.setItem('convo', convo.id)
  },
  
  getLastConvoId(){
    return localStorage.getItem('convo')
  }

}

