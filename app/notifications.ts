import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { supabase } from './supabase';
import { NavigationContainerRef } from '@react-navigation/native';

export function configureNotificationHandling(discreet: boolean) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: !discreet,
      shouldPlaySound: !discreet,
      shouldSetBadge: false,
    }),
  });
}

export async function registerForPushNotifications() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ expo_push_token: token })
        .eq('id', user.id);
    }
  }
  return token;
}

export function handleNotificationResponses(nav: NavigationContainerRef<any>) {
  Notifications.addNotificationResponseReceivedListener((response) => {
    const pulseId = response.notification.request.content.data.pulse_id;
    if (pulseId) {
      nav.navigate('Pulse', { id: pulseId });
    }
  });
}
