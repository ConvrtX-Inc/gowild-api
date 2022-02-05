export class RoomInfo {    
  private _roomID: string;    
  public UserMessages = '';    
    
  constructor(room) {        
    this._roomID = room;   
    this.UserMessages = '';        
  }
      
  get RoomID(): string {
    return this._roomID;
  }
          
}  