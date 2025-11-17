```tsx
import { IPaginatedResponse, ResponseType } from '@/types';
import {
ICategory,
ICategoryStatus,
IUpdateCategoryStatus,
} from '@/types/category-type';
import {
ISubCategory,
IUpdateSubCategoryStatus,
} from '@/types/sub-category-type';
import { apiSlice } from '../api/apiSlice';

const api = apiSlice.injectEndpoints({
endpoints: (builder) => ({
/_=================
_ get Categories
_==================_/
getCategories: builder.query<
ResponseType<ICategory[]>,
{ status?: ICategoryStatus } >({
query: (data) => ({
url: `category${data.status ? `?status=${data.status}` : ''}`,
}),
providesTags: () => ['category'],
}),
/_=================
_ get Categories Paginated
_==================_/
CategoryPaginated: builder.query<
IPaginatedResponse<ICategory>,
{
status?: ICategoryStatus;
page?: number;
limit?: number;
search?: string;
searchFields?: string;
sortBy?: string;
sortOrder?: 'asc' | 'desc';
} >({
query: (data) => {
const params = new URLSearchParams();

    			if (data.status) params.append('status', data.status);
    			if (data.page) params.append('page', data.page.toString());
    			if (data.limit) params.append('limit', data.limit.toString());
    			if (data.search) params.append('search', data.search);
    			if (data.searchFields) params.append('searchFields', data.searchFields);
    			if (data.sortBy) params.append('sortBy', data.sortBy);
    			if (data.sortOrder) params.append('sortOrder', data.sortOrder);

    			const queryString = params.toString();
    			return {
    				url: `category/paginated${queryString ? `?${queryString}` : ''}`,
    			};
    		},
    		providesTags: () => ['category'],
    	}),

    	/*=================
    	 * get Single Category
    	 *==================*/
    	getCategory: builder.query<ResponseType<ICategory>, { id: string }>({
    		query: (data) => {
    			return {
    				url: `category/${data.id}`,
    			};
    		},
    		providesTags: (result, error, { id }) => [{ type: 'category', id }],
    	}),

    	/*=================
    	 * create Category
    	 *==================*/
    	createCategory: builder.mutation<ResponseType<ICategory>, FormData>({
    		query: (data) => {
    			const formData = new FormData();
    			Object.entries(data).forEach(([key, value]) => {
    				if (value) {
    					formData.append(key, value);
    				}
    			});
    			return {
    				url: 'category',
    				method: 'POST',
    				body: formData,
    				formData: true,
    			};
    		},
    		invalidatesTags: ['category'],
    	}),

    	/*=================
    	 * update Category
    	 *==================*/
    	updateCategory: builder.mutation<
    		ResponseType<ICategory>,
    		{ id: string; data: FormData }
    	>({
    		query: ({ id, data }) => ({
    			url: `category/${id}`,
    			method: 'PATCH',
    			body: data,
    		}),
    		invalidatesTags: (result, error, { id }) => [
    			'category',
    			{ type: 'category', id },
    		],
    	}),

    	/*=================
    	 * update Category Status
    	 *==================*/
    	updateCategoryStatus: builder.mutation<
    		ResponseType<ICategory>,
    		{ id: string; status: IUpdateCategoryStatus }
    	>({
    		query: ({ id, status }) => ({
    			url: `category/status/${id}`,
    			method: 'PATCH',
    			body: status,
    		}),
    		invalidatesTags: (result, error, { id }) => [
    			'category',
    			{ type: 'category', id },
    		],
    	}),

    	/*=================
    	 * delete Category
    	 *==================*/
    	deleteCategory: builder.mutation<
    		ResponseType<ICategory>,
    		{ data: { id: string } }
    	>({
    		query: ({ data }) => {
    			console.log(data);
    			return {
    				url: `category/${data.id}`,
    				method: 'DELETE',
    			};
    		},
    		invalidatesTags: ['category'],
    	}),

    	/*==============================================================
    	 *
    	 * Sub Categories
    	 *
    	 *==============================================================*/

    	/*=================
    	 * get Sub Categories
    	 *==================*/
    	getSubCategories: builder.query<
    		ResponseType<ISubCategory[]>,
    		{ status?: string }
    	>({
    		query: (data) => ({
    			url: `sub-category${data.status ? `?status=${data.status}` : ''}`,
    		}),
    		providesTags: () => ['sub-category'],
    	}),

    	/*=================
    	 * get Sub Categories by Category
    	 *==================*/
    	getSubCategoriesByCategory: builder.query<
    		ResponseType<ISubCategory[]>,
    		{ categoryId: string; status?: string }
    	>({
    		query: ({ categoryId, status }) => ({
    			url: `sub-category/category/${categoryId}${
    				status ? `?status=${status}` : ''
    			}`,
    		}),
    		providesTags: (result, error, { categoryId }) => [
    			{ type: 'sub-category', categoryId },
    		],
    	}),

    	/*=================
    	 * get Single Sub Category
    	 *==================*/
    	getSubCategory: builder.query<ResponseType<ISubCategory>, { id: string }>({
    		query: (data) => ({
    			url: `sub-category/${data.id}`,
    		}),
    		providesTags: (result, error, { id }) => [{ type: 'sub-category', id }],
    	}),

    	/*=================
    	 * create Sub Category
    	 *==================*/
    	createSubCategory: builder.mutation<ResponseType<ISubCategory>, FormData>({
    		query: (data) => ({
    			url: 'sub-category',
    			method: 'POST',
    			body: data,
    		}),
    		invalidatesTags: ['sub-category'],
    	}),

    	/*=================
    	 * update Sub Category
    	 *==================*/
    	updateSubCategory: builder.mutation<
    		ResponseType<ISubCategory>,
    		{ id: string; data: FormData }
    	>({
    		query: ({ id, data }) => ({
    			url: `sub-category/${id}`,
    			method: 'PATCH',
    			body: data,
    		}),
    		invalidatesTags: (result, error, { id }) => [
    			'sub-category',
    			{ type: 'sub-category', id },
    		],
    	}),

    	/*=================
    	 * update Sub Category Status
    	 *==================*/
    	updateSubCategoryStatus: builder.mutation<
    		ResponseType<ISubCategory>,
    		{ id: string; status: IUpdateSubCategoryStatus }
    	>({
    		query: ({ id, status }) => ({
    			url: `sub-category/status/${id}`,
    			method: 'PATCH',
    			body: status,
    		}),
    		invalidatesTags: (result, error, { id }) => [
    			'sub-category',
    			{ type: 'sub-category', id },
    		],
    	}),

    	/*=================
    	 * delete Sub Category
    	 *==================*/
    	deleteSubCategory: builder.mutation<
    		ResponseType<ISubCategory>,
    		{ id: string }
    	>({
    		query: ({ id }) => ({
    			url: `sub-category/${id}`,
    			method: 'DELETE',
    		}),
    		invalidatesTags: ['sub-category'],
    	}),
    }),

});

export const {
// Category hooks
useGetCategoriesQuery,
useGetCategoryQuery,
useCreateCategoryMutation,
useUpdateCategoryMutation,
useUpdateCategoryStatusMutation,
useDeleteCategoryMutation,
useCategoryPaginatedQuery,

    // Sub Category hooks
    useGetSubCategoriesQuery,
    useGetSubCategoriesByCategoryQuery,
    useGetSubCategoryQuery,
    useCreateSubCategoryMutation,
    useUpdateSubCategoryMutation,
    useUpdateSubCategoryStatusMutation,
    useDeleteSubCategoryMutation,

} = api;
```
