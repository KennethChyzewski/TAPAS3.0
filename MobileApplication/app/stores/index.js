import ConfigStore from "./config.store"
import AuthStore from "./auth.store"


const config = new ConfigStore()
const auth = new AuthStore() // after config becuase we want to use firebase after its been intialized


export default {config, auth}