export class DataAPI {
	private endpoint = process.env.ATLAS_API_ENDPOINT as string
	private key = process.env.ATLAS_API_KEY as string
	private database = process.env.DATABASE_NAME as string
	private dataSource = process.env.ATLAS_DATASOURCE_NAME as string
	private collectionName: string | null = null
	private defaultBody = {
		database: this.database,
		collection: this.collectionName,
		dataSource: this.dataSource,
	}
	private defaultHeaders = {
		"Content-Type": "application/json",
		"Access-Control-Request-Headers": "*",
		"api-key": this.key,
	}

	// provide values if you want to override the values from the environment variables
	constructor(
		endpoint: string,
		key: string,
		database: string,
		dataSource: string,
		defaultBody: Record<string, unknown> = {},
		defaultHeaders: Record<string, unknown> = {}
	) {
		this.endpoint = endpoint
		this.key = key
		this.database = database
		this.dataSource = dataSource
		this.defaultBody = {
			...this.defaultBody,
			...defaultBody,
		}
		this.defaultHeaders = {
			...this.defaultHeaders,
			...defaultHeaders,
		}
	}

	collection(collection: string) {
		this.collectionName = collection
		return this
	}

	async findMany(query?: Record<string, unknown> | any) {
		const body = JSON.stringify({
			...this.defaultBody,
			...(query ? query : {}),
		})

		const response = await fetch(`${this.endpoint}/action/find`, {
			method: "POST",
			headers: this.defaultHeaders,
			body,
		})

		const data = await response.json()

		return data.documents
	}

	async findOneById(id: string) {
		const body = JSON.stringify({
			...this.defaultBody,
			filter: { _id: { $oid: id } },
		})

		const response = await fetch(`${this.endpoint}/action/findOne`, {
			method: "POST",
			headers: this.defaultHeaders,
			body,
		})

		const data = await response.json()

		return data.document
	}

	async findOne(query: Record<string, unknown> | any) {
		const body = JSON.stringify({
			...this.defaultBody,
			filter: query,
		})

		const response = await fetch(`${this.endpoint}/action/findOne`, {
			method: "POST",
			headers: this.defaultHeaders,
			body,
		})

		const data = await response.json()

		return data.document
	}

	async insertOne(document: Record<string, unknown> | any) {
		const body = JSON.stringify({
			...this.defaultBody,
			document,
		})

		const response = await fetch(`${this.endpoint}/action/insertOne`, {
			method: "POST",
			headers: this.defaultHeaders,
			body,
		})

		const data = await response.json()

		return data.document
	}

	async findOneAndUpdate(
		filter: Record<string, unknown> | any,
		update: Record<string, unknown> | any
	) {
		const body = JSON.stringify({
			...this.defaultBody,
			filter,
			update,
		})

		const response = await fetch(`${this.endpoint}/action/findOneAndUpdate`, {
			method: "POST",
			headers: this.defaultHeaders,
			body,
		})

		const { document } = await response.json()

		return document
	}

	async findOneAndDelete(filter: Record<string, unknown> | any) {
		const body = JSON.stringify({
			...this.defaultBody,
			filter,
		})
	}
}
