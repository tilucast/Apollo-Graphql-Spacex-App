import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { gql, useQuery } from '@apollo/client';
import { LAUNCH_TILE_DATA } from './launches';
import * as GetMyTripsTypes from './__generated__/GetMyTrips'
import { Header, LaunchTile, Loading } from '../components';

export const GET_MY_TRIPS = gql`
  query GetTrips{
    me {
      id
      email
      trips{
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`

interface ProfileProps extends RouteComponentProps {}

const Profile: React.FC<ProfileProps> = () => {

  const {data, loading, error} = useQuery<GetMyTripsTypes.GetMyTrips>
  (GET_MY_TRIPS, {fetchPolicy: "network-only"})

  if(loading) return <Loading />
  if(error) return <p>ERROR: {error.message}</p>
  if(!data) return <p>ERROR</p>

  return (
    <>
      <Header>My Trips</Header>
      {data.me && data.me.trips.length ? (
        data.me.trips.map((launch: any) => (
          <LaunchTile key={launch.id} launch={launch}/>
        ))
      ) : ( <p>You haven't booked any trips yet.</p>)}
    </>
  )
}

export default Profile;