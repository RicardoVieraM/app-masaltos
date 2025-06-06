import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { makeRedirectUri } from 'expo-auth-session';

export default function useGoogleAuth(navigation) {
  const redirectUri = makeRedirectUri({ useProxy: true });

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '224866707202-5hfa2vvu260oo0kt209lcg8ns8r9v7vs.apps.googleusercontent.com',
    redirectUri,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(userCredential => {
          navigation.navigate('inicio', {
            userName: userCredential.user.displayName
          });
        })
        .catch(error => {
          alert("Error con Google Sign-In: " + error.message);
        });
    }
  }, [response]);

  return { request, promptAsync };
}
