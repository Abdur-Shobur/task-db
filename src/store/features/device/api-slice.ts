import { apiSlice } from '../api/apiSlice';
import { Device, DeviceStatus, RegisterDevicePayload } from '@/types/devices';

const api = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		/**
		 * Device Store (Register)
		 **/
		DeviceStore: builder.mutation<Device, RegisterDevicePayload>({
			query: (data) => ({
				url: '/devices/register',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['DEVICES'],
		}),

		/**
		 * Device Update
		 **/
		DeviceUpdate: builder.mutation<
			Device,
			{ uuid: string; data: Partial<RegisterDevicePayload> }
		>({
			query: ({ uuid, data }) => ({
				url: `/devices/${uuid}`,
				method: 'PATCH',
				body: data,
			}),
			invalidatesTags: ['DEVICES'],
		}),

		/**
		 * Device Status Update
		 **/
		// DeviceStatus: builder.mutation<
		// 	Device,
		// 	{ uuid: string; status: DeviceStatus }
		// >({
		// 	query: ({ uuid, status }) => ({
		// 		url: `/devices/${uuid}/status`,
		// 		method: 'PATCH',
		// 		body: { status },
		// 	}),
		// 	invalidatesTags: ['DEVICES'],
		// }),

		/**
		 * Device Status Update (Optimistic)
		 **/
		DeviceStatus: builder.mutation<
			Device,
			{ uuid: string; status: DeviceStatus }
		>({
			query: ({ uuid, status }) => ({
				url: `/devices/${uuid}/status`,
				method: 'PATCH',
				body: { status },
			}),

			// ⭐ Optimistic Update
			async onQueryStarted({ uuid, status }, { dispatch, queryFulfilled }) {
				// Optimistically update cache
				const patchResult = dispatch(
					api.util.updateQueryData(
						'Device',
						{ status: undefined, search: '' }, // query args
						(draft) => {
							const device = draft.find((item) => item.uuid === uuid);
							if (device) {
								device.status = status; // instantly change UI
							}
						}
					)
				);

				try {
					// wait for API response
					await queryFulfilled;
				} catch {
					// ❌ API failed → rollback optimistic update
					patchResult.undo();
				}
			},

			invalidatesTags: ['DEVICES'],
		}),

		/**
		 * Device Delete
		 **/
		DeviceDelete: builder.mutation<{ message: string }, { uuid: string }>({
			query: ({ uuid }) => ({
				url: `/devices/${uuid}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['DEVICES'],
		}),

		/**
		 * Device list
		 **/
		Device: builder.query<Device[], { status?: DeviceStatus; search?: string }>(
			{
				query: ({ status, search = '' }) => {
					const params = new URLSearchParams();
					if (status && (status === 'online' || status === 'offline')) {
						params.append('status', status);
					}
					const queryString = params.toString();
					return {
						url: `/devices${queryString ? `?${queryString}` : ''}`,
					};
				},
				providesTags: () => ['DEVICES'],
				transformResponse: (response: Device[]) => {
					// Filter by search if provided
					return response;
				},
			}
		),
	}),
});

export const {
	useDeviceStoreMutation,
	useDeviceUpdateMutation,
	useDeviceStatusMutation,
	useDeviceDeleteMutation,
	useDeviceQuery,
} = api;
