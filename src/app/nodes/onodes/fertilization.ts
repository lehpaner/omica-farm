import {Node} from '../model/node';
import { NodeFactory } from  '../services/node-factory.service'

export class Fertilization extends Node {
    
    constructor(private _factory: NodeFactory) {
        super('Fertilization', _factory);
		this.name = 'Fertilization';
		this.subtype = 2002;
		this.status = 0;
		this.children = [];
		this.extendedData = {};
	}
}