import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Loading, LoginForm } from '../components';
import * as LoginTypes from './__generated__/login'
import {isLoggedInVar} from '../cache'

export const LOGIN_USER = gql`
  mutation Login($email: String!) {
    login(email: $email) {
      id
      token
    }
  }
`

export default function Login() {

  const [login, {loading, error}] = useMutation<
    LoginTypes.Login, LoginTypes.LoginVariables
  >(LOGIN_USER, {
    onCompleted({login}) {
      if(login) {
        localStorage.setItem('token', login.token as string);
        localStorage.setItem('userId', login.id as string);
        isLoggedInVar(true)
      }
    }
  })

  if(loading) return <Loading />
  if(error) return <p>An error has occurred!</p>

  return (
    <LoginForm login={login}/>
  )
}
