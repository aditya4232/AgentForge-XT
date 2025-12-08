/**
 * Qdrant Vector Database Client
 * Provides RAG capabilities for AgentForge-XT
 */

import { QdrantClient } from '@qdrant/js-client-rest';

// Environment configuration
const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
const QDRANT_API_KEY = process.env.QDRANT_API_KEY; // Optional for local

class AgentForQdrantClient {
    private client: QdrantClient;
    private isConnected: boolean = false;

    constructor() {
        this.client = new QdrantClient({
            url: QDRANT_URL,
            apiKey: QDRANT_API_KEY,
        });
        // Check connection asynchronously if needed, but client init is sync-like config
    }

    /**
     * Test connection to Qdrant
     */
    async testConnection(): Promise<boolean> {
        try {
            await this.client.getCollections();
            this.isConnected = true;
            return true;
        } catch (error) {
            console.error("Qdrant connection failed:", error);
            this.isConnected = false;
            return false;
        }
    }

    /**
     * Create a collection if it doesn't exist
     */
    async ensureCollection(name: string, vectorSize: number = 1536): Promise<void> {
        try {
            const collections = await this.client.getCollections();
            const exists = collections.collections.some(c => c.name === name);

            if (!exists) {
                await this.client.createCollection(name, {
                    vectors: {
                        size: vectorSize,
                        distance: 'Cosine',
                    },
                });
                console.log(`Created Qdrant collection: ${name}`);
            }
        } catch (error) {
            console.error(`Error ensuring collection ${name}:`, error);
            throw error;
        }
    }

    /**
     * Upsert points (vectors + payload)
     */
    async upsertPoints(collectionName: string, points: { id: string | number; vector: number[]; payload?: any }[]) {
        try {
            await this.client.upsert(collectionName, {
                wait: true,
                points,
            });
        } catch (error) {
            console.error("Error upserting points:", error);
            throw error;
        }
    }

    /**
     * Search for similar vectors
     */
    async search(collectionName: string, vector: number[], limit: number = 5, scoreThreshold: number = 0.7) {
        try {
            // Check if collection exists first to avoid 404s on first run
            const collections = await this.client.getCollections();
            if (!collections.collections.some(c => c.name === collectionName)) {
                return [];
            }

            const results = await this.client.search(collectionName, {
                vector,
                limit,
                score_threshold: scoreThreshold,
            });
            return results;
        } catch (error) {
            console.error("Error searching vectors:", error);
            return [];
        }
    }
}

export const qdrantClient = new AgentForQdrantClient();
