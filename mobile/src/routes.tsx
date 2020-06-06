import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './pages/Home';
import Point from './pages/Points';
import Detail from './pages/Details';

const App = createStackNavigator();

const Routes = () => {
    return(
        <NavigationContainer>
            <App.Navigator headerMode="none" screenOptions={{cardStyle: {backgroundColor: '#f0f0f5'}}}>
                <App.Screen name="Home" component={Home} />
                <App.Screen name="Point" component={Point} />
                <App.Screen name="Detail" component={Detail} />
            </App.Navigator>
        </NavigationContainer>
    )
}

export default Routes;
