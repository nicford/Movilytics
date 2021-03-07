import { Injectable } from '@nestjs/common';
import { Item } from '@group8/api-interfaces';

@Injectable()
export class ItemsService {

    private readonly items: Item[] = [
        {
            id: "21345425",
            name: "item one",
            qty: 1,
            description: "descorgnmoerg grewg gewrg"
        },
        {
            id: "1435325",
            name: "item two",
            qty: 4,
            description: "description 2"
        }
    ];

    findAll(): Item[] {
        return this.items;
    }

    findOne(id: string) {
        const result = this.items.find(item => item.id == id);
        console.log(result)
        if (result == undefined){
            return "Item not found";
        } else {
            return result;
        }
    }

}
