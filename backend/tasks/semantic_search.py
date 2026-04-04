"""
Semantic search logic using Google Generative AI embeddings and pure Python similarity.
"""
import os
import json
import struct
import numpy as np
import google.generativeai as genai
from models import insert_vector, get_all_vectors, get_call_by_id

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))

def get_embedding(text: str):
    """Generate embedding for a single text string."""
    result = genai.embed_content(
        model="models/embedding-001",
        content=text,
        task_type="retrieval_document",
        title="Transcript Embedding"
    )
    return result['embedding']

def index_transcript(call_id: str, transcript: str):
    """Generate and store embedding for a transcript."""
    try:
        embedding = get_embedding(transcript)
        # Store as binary BLOB (list of floats)
        embedding_blob = struct.pack(f'{len(embedding)}f', *embedding)
        insert_vector(call_id, embedding_blob)
        return True
    except Exception as e:
        print(f"Error indexing transcript {call_id}: {e}")
        return False

def cosine_similarity(v1, v2):
    """Compute cosine similarity between two vectors."""
    dot_product = np.dot(v1, v2)
    norm_v1 = np.linalg.norm(v1)
    norm_v2 = np.linalg.norm(v2)
    return dot_product / (norm_v1 * norm_v2) if norm_v1 > 0 and norm_v2 > 0 else 0.0

def search_calls(query: str, top_k: int = 5):
    """Perform semantic search for calls matching the query."""
    try:
        query_embedding = get_embedding(query)
        stored_vectors = get_all_vectors()
        
        results = []
        for call_id, blob in stored_vectors:
            # Unpack blob back to floats
            num_floats = len(blob) // 4
            v2 = struct.unpack(f'{num_floats}f', blob)
            
            score = cosine_similarity(query_embedding, v2)
            results.append({"call_id": call_id, "score": float(score)})
        
        # Sort by score descending
        results.sort(key=lambda x: x["score"], reverse=True)
        top_results = results[:top_k]
        
        # Fetch full call details
        final_results = []
        for res in top_results:
            call_data = get_call_by_id(res["call_id"])
            if call_data:
                # Add score to the record
                call_data["search_score"] = res["score"]
                final_results.append(call_data)
                
        return final_results
    except Exception as e:
        print(f"Search error: {e}")
        return []
