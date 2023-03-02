import {Injectable} from "@nestjs/common";
import {OAuth2Client} from "google-auth-library";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class AuthGoogleConfig {
    public google: OAuth2Client;

    constructor(private configService: ConfigService , deviceType: string) {
        if (deviceType==='ios') {
            this.google = new OAuth2Client(
                configService.get('google.clientIdIos'),
                configService.get('google.clientSecret'),
            );
        }else{
            this.google = new OAuth2Client(
                configService.get('google.clientIdAndroid'),
                configService.get('google.clientSecret'),
            );
        }

    }
}