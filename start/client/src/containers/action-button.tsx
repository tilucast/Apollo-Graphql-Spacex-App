import React from 'react';
import { gql, useQuery, useReactiveVar, Reference, useMutation } from '@apollo/client';
import { GET_LAUNCH_DETAILS } from '../pages/launch';
import { Button } from '../components';
import { cartItemsVar } from '../cache';
import * as LaunchDetailsTypes from '../pages/__generated__/LaunchDetails'

export const CANCEL_TRIP = gql`
  mutation cancel($launchId: ID!){
    cancelTrip(launchId: $launchId) {
      success
      message
      launches{
        id
        isBooked
      }
    }
  }
`

interface ActionButtonProps extends Partial<LaunchDetailsTypes.LaunchDetails_launch> {}

const CancelTripButton: React.FC<ActionButtonProps> = ({id}) => {
  const [mutate, {loading, error}] = useMutation(CANCEL_TRIP, {
    variables: {launchId:id},
    update(cache, {data: {cancelTrip}}) {
      const launch = cancelTrip.launches[0]
      cache.modify({
        id: cache.identify({
          __typename: 'User',
          id: localStorage.getItem("userId")
        }),
        fields: {
          trips(existingTrips){
            const launchRef = cache.writeFragment({
              data: launch,
              fragment: gql`
                fragment RemoveLaunch on Launch {
                  id
                }
              `
            })
            return existingTrips.filter((tripRef: Reference) => tripRef === launch)
          }
        }
      })
    }
  })

  if(loading) return <p>Loading ...</p>
  if(error) return <p>An error has occurred.</p>

  return (
    <>
      <Button
        onClick={() => mutate()}
        data-testid={'action-button'}
      >
        Cancel This Trip
      </Button>
    </>
  )
}

const ToggleTripButton: React.FC<ActionButtonProps> = ({id}) => {
  const cartItems = useReactiveVar(cartItemsVar)
  const isInCart = id ? cartItems.includes(id) : false

  return (
    <>
      <Button
        onClick={() => {
          if(id) {
            cartItemsVar(
              isInCart ?
              cartItems.filter(itemId => itemId !== id)
              : [...cartItems, id]
            )
          }
        }}
        data-testid={'action-button'}
      >
        {isInCart ? 'Remove from Cart' : 'Add to Cart'}
      </Button>
    </>
  )
}

const ActionButton: React.FC<ActionButtonProps> = ({ isBooked, id}) => {
  return isBooked ? <CancelTripButton id={id}/> : <ToggleTripButton id={id}/>
}

export default ActionButton