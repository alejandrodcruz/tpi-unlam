
export class TotalEnergy{
    totalEnergy: number;
    EnergyCost: number;
    deviceId: string



    constructor(_totalEnergy : number,_deviceId : string , _EnergyCost : number){
        this.totalEnergy=_totalEnergy;
        this.deviceId = _deviceId;
        this.EnergyCost = _EnergyCost;
    }
  }


