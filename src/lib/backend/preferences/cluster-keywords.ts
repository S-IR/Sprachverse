import * as use from "@tensorflow-models/universal-sentence-encoder";
import { clusterize } from "node-kmeans";
import fs from "fs";
import { z } from "zod";

// The whole document is a script tnhat takes in a keywords array and groups keywords into categories using clustering algorithms. The main steps are:

// Encode the keywords using the Universal Sentence Encoder (TensorFlow model) to obtain embeddings (encodeKeywords).
// Determine the optimal number of clusters using the Kneedle algorithm (optimalNumClusters).
// Cluster the embeddings using the K-means algorithm (clusterGroup).
// Find the closest keyword to a given centroid (findClosestKeyword).
// Group the keywords by cluster and assign a representative word for each cluster (groupKeywordsByClusterWithRepresentatives).
// Group the keywords into categories and print the result (clusterKeywords).

const KeywordGroupSchema = z.record(z.array(z.string()));

export type KeywordGroup = z.infer<typeof KeywordGroupSchema>;

interface ClusterObject {
  centroid: number[];
  sumOfSquares: number;
  clusterInd: number[];
}

// Encode keywords using Universal Sentence Encoder
/**
 * Encodes a keyword using the tensorflow model and returns the embedding
 * @param {*} keywords The keyword that you want to encode
 * @returns {embedding} a vector representing the keyword
 */
const encodeKeywords = async (
  keywords: string[]
): Promise<use.TensorBuffer> => {
  const model = await use.load();
  const embeddings = await model.embed(keywords);
  return embeddings;
};

/**
 * Finds the optimal amount of clusters for a particular dataset through the Kneedle algorithm
 * @param {*} data The array of keywords that you would like to be clustered
 * @param {*} maxClusters The maximum amount of clusters that you can have
 * @returns {numClusters} the number of optimal clusters
 */
const optimalNumClusters = async (
  data: number[][],
  maxClusters: number
): Promise<number> => {
  const distortions: number[] = [];

  //go through each possible amount of clusters. Measure the amount of distorsions that the cluster has and then put them on an array
  for (let k = 1; k < maxClusters; k++) {
    const clusters = await clusterGroup(data, k);
    const distortion = clusters.reduce((sum, cluster) => {
      return sum + cluster.sumOfSquares;
    }, 0);
    distortions.push(distortion);
  }

  //Take the distorsion array and then create a new array containing the rate of change of distorsion between a number of clusters K and K-1
  const rateOfChange = distortions.map((distortion, index) => {
    if (index === 0) return 0;
    return distortions[index - 1] - distortion;
  });

  // Normalize rate of change
  const normalizedRateOfChange = rateOfChange.map((change, index) => {
    return change / (distortions[index] || 1);
  });

  // Calculate the difference in the normalized rate of change
  const difference = normalizedRateOfChange.map((change, index) => {
    if (index === 0) return 0;
    return normalizedRateOfChange[index - 1] - change;
  });

  // Find the index with the highest difference
  const elbowPoint = difference.reduce((maxIndex, value, index, array) => {
    return value > array[maxIndex] ? index : maxIndex;
  }, 0);
  if (elbowPoint < 2) return 3;
  return elbowPoint + 1;
};

/**
 * Cluster the given embeddings into a specified number of clusters.
 * @param {number[][]} embeddings - The embeddings of the keywords.
 * @param {number} numClusters - The number of clusters to create.
 * @returns {Promise<Object[]>} A promise that resolves to an array of clusters.
 */
const clusterGroup = async (
  embeddings: number[][],
  numClusters: number
): Promise<ClusterObject[]> => {
  return new Promise((resolve, reject) => {
    clusterize(
      embeddings,
      { k: numClusters },
      (err: any, clusters: ClusterObject[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(clusters);
        }
      }
    );
  });
};

/**
 * Simple function to return the euclidian distance between 2 points
 * @param {*} pointA The first point
 * @param {*} pointB The second point
 * @returns {distance} a number representing the euclidian distance
 */
const euclideanDistance = (pointA: number[], pointB: number[]): number => {
  return Math.sqrt(
    pointA.reduce((sum, value, index) => {
      return sum + Math.pow(value - pointB[index], 2);
    }, 0)
  );
};

/**
 * Find the closest keyword to a given centroid.
 * @param {number[]} centroid - The centroid to find the closest keyword to.
 * @param {number[][]} embeddings - The embeddings of the keywords.
 * @param {string[]} keywords - The array of keywords.
 * @returns {string} The closest keyword to the centroid.
 */
const findClosestKeyword = (
  centroid: number[],
  embeddings: number[][],
  keywords: string[]
): string => {
  let minDistance = Infinity;
  let closestKeywordIndex = -1;

  embeddings.forEach((embedding, index) => {
    const distance = euclideanDistance(centroid, embedding);
    if (distance < minDistance) {
      minDistance = distance;
      closestKeywordIndex = index;
    }
  });

  return keywords[closestKeywordIndex];
};

/**
 * Groups keywords by cluster and assigns a representative word for each cluster.
 * @param {Object[]} clusters - The clusters generated by the clustering algorithm.
 * @param {number[][]} embeddings - The embeddings of the keywords.
 * @param {string[]} keywords - The array of keywords.
 * @returns {Object} An object with representative words as keys and arrays of keywords as values.
 */
const groupKeywordsByClusterWithRepresentatives = (
  clusters: ClusterObject[],
  embeddings: number[][],
  keywords: string[]
): KeywordGroup => {
  const groupedKeywords: { [key: string]: string[] } = {};

  clusters.forEach((cluster, clusterIndex) => {
    const centroid = cluster.centroid;
    const representativeWord = findClosestKeyword(
      centroid,
      embeddings,
      keywords
    );

    groupedKeywords[representativeWord] = [];

    cluster.clusterInd.forEach((keywordIndex) => {
      const keyword = keywords[keywordIndex];
      groupedKeywords[representativeWord].push(keyword);
    });
  });

  return groupedKeywords;
};

/**
 * Takes in an array of keywords and returns an object that groups those keywords based on some created categories
 * @param keywords the array of keywords from the user
 * @returns {KeywordGroup} the keyword group
 */
export const clusterKeywords = async (
  keywords: string[]
): Promise<KeywordGroup> => {
  const embeddings = await encodeKeywords(keywords);
  const maxClusters = 10;
  const numClusters = await optimalNumClusters(
    embeddings.arraySync(),
    maxClusters
  );
  const clusters = await clusterGroup(embeddings.arraySync(), numClusters);

  // Add this line to the end of your code.
  const groupedKeywords = groupKeywordsByClusterWithRepresentatives(
    clusters,
    embeddings.arraySync(),
    keywords
  );
  console.log("Grouped keywords:", groupedKeywords);
  z.record(z.array(z.string())).parse(groupedKeywords);
  return groupedKeywords;
};
