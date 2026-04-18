import { Location } from "../../measurement/domain/valueObjects/Location";

export class WeatherStation {
    constructor(
        public readonly id: string | null,
        public name: string,
        public location: Location,
        public sensorModel: string,
        public state: boolean,
        public ownerId: string,
    ){}
}