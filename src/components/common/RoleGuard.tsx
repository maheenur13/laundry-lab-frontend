import React, { useEffect } from 'react';
import { useRouter, useSegments, useGlobalSearchParams } from 'expo-router';
import { View, ActivityIndicator, Platform } from 'react-native';
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
    const searchParams = useGlobalSearchParams();
    const { user, isAuthenticated, isLoading } = useAuthStore();

    useEffect(() => {
        // Don't redirect while auth is still loading
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(auth)';
        const inCustomerGroup = segments[0] === '(customer)';
        const inDeliveryGroup = segments[0] === '(delivery)';
        const inAdminGroup = segments[0] === '(admin)';
        const isInValidRoleGroup = inAuthGroup || inCustomerGroup || inDeliveryGroup || inAdminGroup;

        // Temporary debug logging to understand the issue
        if (Platform.OS === 'web') {
            console.log('🔍 RoleGuard Debug:');
            console.log('- segments:', segments);
            console.log('- searchParams:', searchParams);
            console.log('- user role:', user?.role);
            console.log('- isAuthenticated:', isAuthenticated);
            console.log('- isInValidRoleGroup:', isInValidRoleGroup);
        }

        // Helper function to preserve query parameters during redirect
        const redirectWithParams = (path: string) => {
            if (Object.keys(searchParams).length > 0) {
                // If we have query parameters, use router.push with the full URL
                const queryString = '?' + new URLSearchParams(searchParams as Record<string, string>).toString();
                const fullPath = path + queryString;

                if (Platform.OS === 'web') {
                    console.log('🔄 Redirecting to:', fullPath);
                }

                router.push(fullPath as any);
            } else {
                // No query parameters, use regular replace
                if (Platform.OS === 'web') {
                    console.log('🔄 Redirecting to:', path);
                }

                router.replace(path as any);
            }
        };

        // If not authenticated, redirect to login
        if (!isAuthenticated || !user) {
            if (!inAuthGroup) {
                redirectWithParams('/(auth)/login');
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

            redirectWithParams(targetRoute);
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

                redirectWithParams(targetRoute);
                return;
            }

            if (directRoute === 'order-details') {
                const targetRoute = userRole === UserRole.CUSTOMER ? '/(customer)/home' :
                    userRole === UserRole.DELIVERY ? '/(delivery)/order-details' :
                        userRole === UserRole.ADMIN ? '/(admin)/order-details' :
                            '/(customer)/home';

                redirectWithParams(targetRoute);
                return;
            }

            if (directRoute === 'dashboard') {
                const targetRoute = userRole === UserRole.CUSTOMER ? '/(customer)/home' :
                    userRole === UserRole.DELIVERY ? '/(delivery)/dashboard' :
                        userRole === UserRole.ADMIN ? '/(admin)/dashboard' :
                            '/(customer)/home';

                redirectWithParams(targetRoute);
                return;
            }

            if (directRoute === 'profile') {
                const targetRoute = userRole === UserRole.CUSTOMER ? '/(customer)/profile' :
                    userRole === UserRole.DELIVERY ? '/(delivery)/profile' :
                        userRole === UserRole.ADMIN ? '/(admin)/profile' :
                            '/(customer)/profile';

                redirectWithParams(targetRoute);
                return;
            }

            // For any other unknown direct route, redirect to appropriate dashboard
            const targetRoute = userRole === UserRole.CUSTOMER ? '/(customer)/home' :
                userRole === UserRole.DELIVERY ? '/(delivery)/dashboard' :
                    userRole === UserRole.ADMIN ? '/(admin)/dashboard' :
                        '/(customer)/home';

            redirectWithParams(targetRoute);
            return;
        }

        // Prevent role-based route violations with context preservation
        if (userRole === UserRole.CUSTOMER && (inDeliveryGroup || inAdminGroup)) {
            redirectWithParams('/(customer)/home');
            return;
        }

        if (userRole === UserRole.DELIVERY && (inCustomerGroup || inAdminGroup)) {
            // Preserve page context when redirecting from admin routes
            if (inAdminGroup && segments[1] === 'orders') {
                redirectWithParams('/(delivery)/orders');
                return;
            }

            if (inAdminGroup && segments[1] === 'order-details') {
                redirectWithParams('/(delivery)/order-details');
                return;
            }

            if (inAdminGroup && segments[1] === 'dashboard') {
                redirectWithParams('/(delivery)/dashboard');
                return;
            }

            if (inAdminGroup && segments[1] === 'profile') {
                redirectWithParams('/(delivery)/profile');
                return;
            }

            // Default fallback
            redirectWithParams('/(delivery)/dashboard');
            return;
        }

        if (userRole === UserRole.ADMIN && (inCustomerGroup || inDeliveryGroup)) {
            // Preserve page context when redirecting from delivery routes
            if (inDeliveryGroup && segments[1] === 'orders') {
                redirectWithParams('/(admin)/orders');
                return;
            }

            if (inDeliveryGroup && segments[1] === 'order-details') {
                redirectWithParams('/(admin)/order-details');
                return;
            }

            if (inDeliveryGroup && segments[1] === 'dashboard') {
                redirectWithParams('/(admin)/dashboard');
                return;
            }

            if (inDeliveryGroup && segments[1] === 'profile') {
                redirectWithParams('/(admin)/profile');
                return;
            }

            // Default fallback
            redirectWithParams('/(admin)/dashboard');
            return;
        }

        // User has valid access to current route
    }, [isAuthenticated, user, segments, searchParams, isLoading, router]);

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