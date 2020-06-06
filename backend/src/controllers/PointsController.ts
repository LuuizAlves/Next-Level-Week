import {Request, Response} from 'express'
import knex from '../database/connection';

class PointsController{
    async index(request: Request, response: Response){
        const { city, uf, items } = request.query;

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));
        
        const points = await knex('points')
            .join('points_items', 'points.id', '=', 'points_items.point_id')
            .whereIn('points_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');
        
        return response.json(points);
    }

    async show(request: Request, response: Response){
        const { id } = request.params;

        const point = await knex('points').where('id', id).first();

        if(!point){
            return response.status(400).json({message: 'Point not found!'});
        };

        const items = await knex('items')
            .join('points_items', 'items.id', '=', 'points_items.item_id')
            .where('points_items.point_id', id)
            .select('items.title');
        
        return response.json({point, items});
    }

    async create(request: Request, response: Response){
        const { name, email, whatsapp, latitude, longitude, city, uf, items } = request.body;

        const trx = await knex.transaction();

        const point = {
            image: 'https://i.pinimg.com/564x/c1/d9/d4/c1d9d483793dc05da7fba084fc1ea843.jpg',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        }

        const insertsIds = await trx('points').insert(point)

        const point_id = insertsIds[0]
        const pointItems = items.map((item_id: number) => {
            return {
                item_id,
                point_id
            }
        })
        await trx('points_items').insert(pointItems);

        await trx.commit();

        return response.json({
            point_id,
            ...point
        });
    }
}

export default PointsController;