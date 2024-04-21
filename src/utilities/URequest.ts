import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class URequest {

    constructor(private http: HttpService) { }

    async consumeDataServices(url: string, type: string, data?: any) {

        console.log("____________________________________________________________________________________________");
        console.log("Consume API Services");

        try {
            console.log("Url ", url);
            console.log("Data json", data);
            let response: any = null;

            //HTTP GET Request
            if (type == "get") {
                response = await lastValueFrom(
                    this.http.get(url)
                )
            }

            //HTTP POST Request
            else if (type == "post") {
                response = await lastValueFrom(
                    this.http.post(url, data)
                )
            }

            //HTTP PUT Request
            else if (type == "put") {
                response = await lastValueFrom(
                    this.http.put(url, data)
                )
            }

            //HTTP DELETE Request
            else if (type == "delete") {
                response = await lastValueFrom(
                    this.http.delete(url, data)
                )
            }

            console.log("Body response: ", response.data)
            return response.data;

        } catch (error) {
            return "Error: " + error;
        }
    }
}
