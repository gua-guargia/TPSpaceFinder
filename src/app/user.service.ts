import { Injectable } from '@angular/core'

interface user {
    username: string,
    email: string,
    password: string,
    gender: string
}

@Injectable()
export class UserService {
    private user: user

    constructor() {

    }

    setUser(user:user) {
        this.user = user
    }

    //getUID or whatever() {
    //    return this.user.uid
    //}
}