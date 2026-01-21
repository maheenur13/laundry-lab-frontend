import React, { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../../stores/authStore';
import { UserRole } from '../../types/user';
import { colors } from '../../constants/theme';

interface RoleGuardProps {
    children: React.ReactNode;
}

/**
 * Role-based route protection component.
 * Redirects users to appropriate routes based on their role and authentication status.
 */
export function RoleGuard({ children }: RoleGuardProps) {
    const router = useRouter();
    const segments = useSegments();
    const { user, isAuthenticated, isLoading } = useAuthStore();

    useEffect(() => {
        // Don't redirect while auth is still loading
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(auth)';
        const inCustomerGroup = segments[0] === '(customer)';
        const inDeliveryGroup = segments[0] === '(delivery)';
        const inAdminGroup = segments[0] === '(admin)';
        const isInValidRoleGroup = inAuthGroup || inCustomerGroup || inDeliveryGroup || inAdminGroup;

        // If not authenticated, redirect to login
        if (!isAuthenticated || !user) {
            if (!inAuthGroup) {
                router.replace('/(auth)/login');
            }
            return;
        }

        // If authenticated, check role-based access
        const userRole = user.role;

        // Redirect from auth pages to appropriate dashboard after login
        if (inAuthGroup) {
            const targetRoute = userRole === UserRole.CUSTOMER ? '/(customer)/home' :
                userRole === UserRole.DELIVERY ? '/(delivery)/dashboard' :
                    userRole === UserRole.ADMIN ? '/(admin)/dashboard' :
                        '/(customer)/home';

            router.replace(targetRoute);
            return;
        }

        // Handle direct routes that should map to role-specific routes
        if (!isInValidRoleGroup) {
            const directRoute = segments[0];

            // Map common direct routes to role-specific routes
            if (directRoute === 'orders') {
                const targetRoute = userRole === UserRole.CUSTOMER ? '/(customer)/home' :
                    userRole === UserRole.DELIVERY ? '/(delivery)/orders' :
                        userRole === UserRole.ADMIN ? '/(admin)/orders' :
                            '/(customer)/home';

                router.replace(targetRoute);
                return;
            }

            if (directRoute === 'dashboard') {
                const targetRoute = userRole === UserRole.CUSTOMER ? '/(customer)/home' :
                    userRole === UserRole.DELIVERY ? '/(delivery)/dashboard' :
                        userRole === UserRole.ADMIN ? '/(admin)/dashboard' :
                            '/(customer)/home';

                router.replace(targetRoute);
                return;
            }

            if (directRoute === 'profile') {
                const targetRoute = userRole === UserRole.CUSTOMER ? '/(customer)/profile' :
                    userRole === UserRole.DELIVERY ? '/(delivery)/profile' :
                        userRole === UserRole.ADMIN ? '/(admin)/profile' :
                            '/(customer)/profile';

                router.replace(targetRoute);
                return;
            }

            // For any other unknown direct route, redirect to appropriate dashboard
            const targetRoute = userRole === UserRole.CUSTOMER ? '/(customer)/home' :
                userRole === UserRole.DELIVERY ? '/(delivery)/dashboard' :
                    userRole === UserRole.ADMIN ? '/(admin)/dashboard' :
                        '/(customer)/home';

            router.replace(targetRoute);
            return;
        }

        // Prevent role-based route violations with context preservation
        if (userRole === UserRole.CUSTOMER && (inDeliveryGroup || inAdminGroup)) {
            router.replace('/(customer)/home');
            return;
        }

        if (userRole === UserRole.DELIVERY && (inCustomerGroup || inAdminGroup)) {
            // Preserve page context when redirecting from admin routes
            if (inAdminGroup && segments[1] === 'orders') {
                router.replace('/(delivery)/orders');
                return;
            }

            if (inAdminGroup && segments[1] === 'dashboard') {
                router.replace('/(delivery)/dashboard');
                return;
            }

            if (inAdminGroup && segments[1] === 'profile') {
                router.replace('/(delivery)/profile');
                return;
            }

            // Default fallback
            router.replace('/(delivery)/dashboard');
            return;
        }

        if (userRole === UserRole.ADMIN && (inCustomerGroup || inDeliveryGroup)) {
            // Preserve page context when redirecting from delivery routes
            if (inDeliveryGroup && segments[1] === 'orders') {
                router.replace('/(admin)/orders');
                return;
            }

            if (inDeliveryGroup && segments[1] === 'dashboard') {
                router.replace('/(admin)/dashboard');
                return;
            }

            if (inDeliveryGroup && segments[1] === 'profile') {
                router.replace('/(admin)/profile');
                return;
            }

            // Default fallback
            router.replace('/(admin)/dashboard');
            return;
        }

        // User has valid access to current route
    }, [isAuthenticated, user, segments, isLoading, router]);

    // Show loading spinner while auth is initializing
    if (isLoading) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.background.primary,
            }}>
                <ActivityIndicator size="large" color={colors.primary[600]} />
            </View>
        );
    }

    return <>{children}</>;
}