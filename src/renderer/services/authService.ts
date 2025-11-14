import { computed, ref } from 'vue';

export type UserRole = 'user' | 'admin';

const role = ref<UserRole>('user');

export function useAuth() {
  const isAdmin = computed(() => role.value === 'admin');

  const setRole = (nextRole: UserRole) => {
    role.value = nextRole;
  };

  return {
    role,
    isAdmin,
    setRole,
  };
}
