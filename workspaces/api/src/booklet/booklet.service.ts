import { Best_Practice_Card } from '@app/entity/best_practice_card';
import { Bad_Practice_Card } from '@app/entity/bad_practice_card';
import { Green_IT_Booklet } from '../entity/green_it_booklet';
import { User } from '@app/entity/user';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BookletService {
    constructor(
        @InjectRepository(User)
        private user_repository : Repository<User>,
        @InjectRepository(Green_IT_Booklet)
        private readonly booklet_repository : Repository<Green_IT_Booklet>
       
    ){}

    async createBooklet(user_id : number) : Promise <{booklet : Green_IT_Booklet}>{
        let user = await this.user_repository.findOne({where : {id : user_id}});
        if (!user) {
            
            throw new Error(`User with id ${user_id} not found`);
        }
        let booklet : Green_IT_Booklet = this.booklet_repository.create({
            user_id: user_id,
            user : user[0] ,
            practices_to_ban :[],
            practices_to_apply :[],
            //trainings : [],
        });
        await this.booklet_repository.save(booklet);
        (await user).green_it_booklet_id = booklet.id; 
        await this.user_repository.save(user);
        return {booklet: booklet};
    }

    async getBooklet(user_id : number) : Promise <{booklet : Green_IT_Booklet}>{
        const existingBooklet = await this.booklet_repository.findOne({where : {user_id : user_id}});
        if (!existingBooklet) {
            throw new Error(`Booklet for user with id ${user_id} not found`);
        }
        return {booklet : existingBooklet};
    }

    async getAppliedPractices (user_id: number) : Promise <{practices : Best_Practice_Card[]}>{
        const existingBooklet = await this.booklet_repository.findOne({where : {user_id : user_id}, relations : ['practices_to_apply']});
        if (!existingBooklet) {
            throw new Error(`Booklet for user with id ${user_id} not found`);
        }
        console.log("[booklet service] getAppliedPractices",existingBooklet.practices_to_apply);
        return {practices : existingBooklet.practices_to_apply};
    }

    async getBannedPractices (user_id: number) : Promise <{practices: Bad_Practice_Card []}> {
        console.log("[booklet service] getBannedPractices, user id",user_id);
        const existingBooklet = await this.booklet_repository.findOne({where : {user_id : user_id}, relations : ['practices_to_ban']});
        console.log("[booklet service] getBannedPractices",existingBooklet);
        if (!existingBooklet) {
            throw new Error(`Booklet for user with id ${user_id} not found`);
        }
        console.log("[booklet service] getBannedPractices",existingBooklet.practices_to_ban);
        return {practices : existingBooklet.practices_to_ban};
    }

}
