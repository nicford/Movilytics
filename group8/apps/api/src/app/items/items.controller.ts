import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { CreateItemDto } from "./dto/create-item.dto"
import { ItemsService } from "./items.service";
import { Item } from '@group8/api-interfaces'

import { Request, Response } from "express";

@Controller('items')
export class ItemsController {

    constructor(private readonly itemsService: ItemsService) {}

    @Get()
    findAll(): Item[] {
        return this.itemsService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string): Item | string {
        return this.itemsService.findOne(id);
    }

    @Post()
    create(@Body() createItemDto: CreateItemDto): string {
        return `Name: ${createItemDto.name} Desc: ${createItemDto.description}`
    }

}
