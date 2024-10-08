import { Injectable } from '@angular/core';


interface Carbon {
  kgCO2: number;
}


@Injectable({
  providedIn: 'root'
})
export class CarbonService {

  constructor() { }

  getTree(carbon :Carbon): number{
    return 2;
  }

}
