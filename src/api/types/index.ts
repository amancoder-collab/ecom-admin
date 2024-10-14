import { AxiosError } from "axios"

export interface IApiResponse<
  T extends {
    [key: string]: any
  }
> {
  success: boolean
  statusCode: number
  data: T | null
  errors: {
    [key: string]: string
  }
  meta?: {
    total: number
    items: number
    currentPage: number
    perPage: number
    lastPage: number
    [key: string]: any
  }
  path: string
  message: string
  stackTrace?: string
}

export type IApiParams = {
  page?: number
  limit?: number
  sort?: string
  searchFields?: string
  search?: string
}

export type IApiError = AxiosError<IApiResponse<any>>
