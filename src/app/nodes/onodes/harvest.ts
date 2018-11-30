import {Node} from '../model/node';
import { NodeFactory } from  '../services/node-factory.service'

export class Harvest extends Node {
    
    constructor(private _factory: NodeFactory) {
        super('Harvest', _factory);
		this.name = 'Harvest';
		this.subtype = 2005;
		this.status = 0;
		this.children = [];
		this.extendedData = {};
	}
}