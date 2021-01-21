interface Launch {
    __typename: String,
    id: String,
    isBooked: Boolean,
    mission: {
        __typename: String,
        missionPatch: String,
        name: String
    }
    rocket: {
        __typename: String,
        id: String,
        name: String
    }
}

export type {Launch}