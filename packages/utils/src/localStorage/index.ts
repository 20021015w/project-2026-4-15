export class LocalStorage {
  private static accessToken = 'accessToken'
  private static refreshToken = 'refreshToken'
  static getLocal (key:string){
    return localStorage.getItem(key) ?? ''
  }

  static setLocal(key:string,value:string,expired:string = '0'){
    localStorage.setItem(key,this.getData(value,expired))
  }
  private static getData(value:string,expired:string){
    return JSON.stringify({
      value,
      expiredAt:new Date().getTime() + expired
    })
  }
}