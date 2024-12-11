/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Dependencies from "@/shared/types/Dependencies";

export class App {
    private enrivonment: Dependencies['environment'];

    constructor({ environment }: Pick<Dependencies, 'environment'>) {
        this.enrivonment = environment;
    }

    start() {
        console.log("Starting application... ", this.enrivonment);
    }

}