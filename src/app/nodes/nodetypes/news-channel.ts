import {Node} from '../model/node';
import { NodeFactory } from  '../services/node-factory.service'

export class NewsChannel extends Node {
    
    constructor(private _factory: NodeFactory) {
        super('NewsChannel', _factory);
		this.name = 'NewsChannel';
		this.subtype = 1150;
		this.status = 0;
		this.children = [];
		this.extendedData = {};
	}
}