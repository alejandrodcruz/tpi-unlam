
export class TotalEnergy{
    totalEnergy: number;
    energyCost: number;
    deviceId: string



    constructor(_totalEnergy : number,_deviceId : string , _energyCost : number){
        this.totalEnergy=_totalEnergy;
        this.deviceId = _deviceId;
        this.energyCost = _energyCost;
    }
  }


