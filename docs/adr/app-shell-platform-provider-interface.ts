/**
 * PlatformProvider Interface Draft
 *
 * This file defines the proposed interface for platform abstraction in
 * odh-dashboard. Platform packages (platform-openshift, platform-kubernetes,
 * platform-coreweave, etc.) would implement this interface.
 *
 * Feature packages would import types from this file (via platform-core package)
 * and NEVER import platform-specific implementations directly.
 *
 * STATUS: DRAFT for review -- not production code.
 */

import type { K8sModelCommon, K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';

// ---------------------------------------------------------------------------
// Platform Identity
// ---------------------------------------------------------------------------

export enum PlatformType {
  OPENSHIFT = 'openshift',
  KUBERNETES = 'kubernetes',
  COREWEAVE = 'coreweave',
  AZURE = 'azure',
  GCP = 'gcp',
}

export interface PlatformInfo {
  type: PlatformType;
  /** Human-readable name (e.g., "OpenShift 4.17", "CoreWeave K8s") */
  displayName: string;
  /** Cluster base domain, if discoverable */
  baseDomain?: string;
  /** Cluster version, if discoverable */
  clusterVersion?: string;
  /** Cloud provider, if discoverable */
  cloudProvider?: string;
}

// ---------------------------------------------------------------------------
// Namespace Management
// ---------------------------------------------------------------------------

/**
 * Platform-neutral namespace representation.
 * On OpenShift, this maps from a Project. On vanilla K8s, from a Namespace.
 */
export interface PlatformNamespace {
  name: string;
  displayName: string;
  description: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  creationTimestamp?: string;
}

export interface NamespaceOperations {
  /** K8s model to use for namespace resources */
  namespaceModel: K8sModelCommon;

  /** List namespaces the current user has access to */
  listNamespaces(): Promise<PlatformNamespace[]>;

  /** Create a new namespace */
  createNamespace(name: string, displayName?: string, description?: string): Promise<PlatformNamespace>;

  /** Update namespace metadata (display name, description) */
  updateNamespace(name: string, displayName?: string, description?: string): Promise<PlatformNamespace>;

  /** Delete a namespace */
  deleteNamespace(name: string): Promise<void>;

  /**
   * Get the display name for a namespace.
   * On OpenShift: reads openshift.io/display-name annotation.
   * On vanilla K8s: reads app.kubernetes.io/display-name or falls back to metadata.name.
   */
  getDisplayName(resource: K8sResourceCommon): string;

  /**
   * Get the description for a namespace.
   * On OpenShift: reads openshift.io/description annotation.
   * On vanilla K8s: reads app.kubernetes.io/description or kubernetes.io/description.
   */
  getDescription(resource: K8sResourceCommon): string;
}

// ---------------------------------------------------------------------------
// External Endpoint / Routing
// ---------------------------------------------------------------------------

/**
 * Platform-neutral external endpoint representation.
 * On OpenShift, derived from Route. On vanilla K8s, from Ingress or Gateway API.
 */
export interface PlatformExternalEndpoint {
  url: string;
  hostname: string;
  tlsEnabled: boolean;
  /** Source resource that provides this endpoint */
  source: 'route' | 'ingress' | 'gateway' | 'loadbalancer';
}

export interface RoutingOperations {
  /**
   * Get the external URL for a service.
   * On OpenShift: reads Route resources.
   * On vanilla K8s: reads Ingress or Gateway API resources.
   */
  getExternalEndpoint(
    namespace: string,
    serviceName: string,
  ): Promise<PlatformExternalEndpoint | undefined>;

  /**
   * List all external endpoints in a namespace.
   */
  listExternalEndpoints(namespace: string): Promise<PlatformExternalEndpoint[]>;
}

// ---------------------------------------------------------------------------
// User Identity
// ---------------------------------------------------------------------------

export interface PlatformUser {
  username: string;
  uid?: string;
  groups: string[];
  isAdmin: boolean;
}

export interface IdentityOperations {
  /**
   * Resolve the current user's identity.
   * On OpenShift: User API + Group API fallback chain.
   * On vanilla K8s: OIDC/JWT token parsing or SelfSubjectReview.
   */
  getCurrentUser(): Promise<PlatformUser>;

  /**
   * Check if the current user is an admin.
   * On OpenShift: SSAR check against Auth CRD.
   * On vanilla K8s: SSAR check against configurable resource, or RBAC role check.
   */
  isAdmin(): Promise<boolean>;

  /**
   * List available groups.
   * On OpenShift: user.openshift.io/v1 Group resources.
   * On vanilla K8s: returns empty (no native groups) or reads from alternative source.
   */
  listGroups(): Promise<string[]>;
}

// ---------------------------------------------------------------------------
// Monitoring / Metrics
// ---------------------------------------------------------------------------

export interface MonitoringConfig {
  /** Prometheus-compatible query endpoint URL */
  prometheusEndpoint: string;
  /** Namespace where the monitoring stack is deployed */
  monitoringNamespace: string;
  /** Service name for the query frontend */
  queryServiceName: string;
  /** Port for the query service */
  queryPort: string;
}

export interface MonitoringOperations {
  /**
   * Get the monitoring configuration for this platform.
   * On OpenShift: Thanos in openshift-monitoring.
   * On vanilla K8s: configurable Prometheus endpoint.
   */
  getMonitoringConfig(): MonitoringConfig;
}

// ---------------------------------------------------------------------------
// Capability Detection
// ---------------------------------------------------------------------------

/**
 * Maps to DataScienceStackComponent values but abstracted from the DSC CRD.
 */
export interface PlatformCapabilities {
  /**
   * Check if a K8s CRD is available on the cluster.
   * Used as a replacement for DSC component status on non-OpenShift clusters.
   */
  isCRDAvailable(apiGroup: string, version: string, kind: string): Promise<boolean>;

  /**
   * Get the status of a named component (e.g., 'kserve', 'modelregistry').
   * On OpenShift: reads DataScienceCluster status.
   * On vanilla K8s: checks CRD existence and/or Helm release status.
   */
  isComponentAvailable(componentName: string): Promise<boolean>;

  /**
   * List all available components on this cluster.
   */
  listAvailableComponents(): Promise<string[]>;
}

// ---------------------------------------------------------------------------
// Annotation Mapping
// ---------------------------------------------------------------------------

/**
 * Platform-specific annotation key conventions.
 * Feature code should use these constants instead of hardcoding annotation keys.
 */
export interface AnnotationConventions {
  displayName: string;
  description: string;
}

// ---------------------------------------------------------------------------
// Template / Serving Runtime Storage
// ---------------------------------------------------------------------------

export interface TemplateOperations {
  /**
   * K8s model to use for serving runtime templates.
   * On OpenShift: TemplateModel (template.openshift.io).
   * On vanilla K8s: ConfigMap with specific labels.
   */
  templateModel: K8sModelCommon;

  /**
   * List serving runtime templates.
   */
  listServingRuntimeTemplates(namespace: string): Promise<K8sResourceCommon[]>;
}

// ---------------------------------------------------------------------------
// Main PlatformProvider Interface
// ---------------------------------------------------------------------------

export interface PlatformProvider {
  /** Platform identification */
  info: PlatformInfo;

  /** Annotation key conventions for this platform */
  annotations: AnnotationConventions;

  /** Namespace management operations */
  namespaces: NamespaceOperations;

  /** External endpoint / routing operations */
  routing: RoutingOperations;

  /** User identity operations */
  identity: IdentityOperations;

  /** Monitoring configuration and operations */
  monitoring: MonitoringOperations;

  /** Capability detection */
  capabilities: PlatformCapabilities;

  /** Template / serving runtime storage */
  templates: TemplateOperations;
}

// ---------------------------------------------------------------------------
// Platform Context (React)
// ---------------------------------------------------------------------------

/**
 * React context shape. The app shell provides this after platform detection
 * and initialization.
 */
export interface PlatformContextValue {
  platform: PlatformProvider;
  loading: boolean;
  error?: Error;
}

// ---------------------------------------------------------------------------
// OpenShift Implementation Sketch
// ---------------------------------------------------------------------------

/*
 * packages/platform-openshift/ would implement PlatformProvider with:
 *
 * info.type = PlatformType.OPENSHIFT
 * annotations.displayName = 'openshift.io/display-name'
 * annotations.description = 'openshift.io/description'
 * namespaces.namespaceModel = ProjectModel (project.openshift.io)
 * routing: reads Route resources (route.openshift.io)
 * identity: User API + Group API + SSAR against Auth CRD
 * monitoring: Thanos in openshift-monitoring:9092
 * capabilities: DSC status + CRD checks
 * templates: TemplateModel (template.openshift.io)
 */

// ---------------------------------------------------------------------------
// Kubernetes Implementation Sketch
// ---------------------------------------------------------------------------

/*
 * packages/platform-kubernetes/ would implement PlatformProvider with:
 *
 * info.type = PlatformType.KUBERNETES
 * annotations.displayName = 'app.kubernetes.io/display-name'
 * annotations.description = 'app.kubernetes.io/description'
 * namespaces.namespaceModel = NamespaceModel (v1)
 * routing: reads Ingress resources (networking.k8s.io) or Gateway API
 * identity: OIDC/JWT parsing + SelfSubjectReview
 * monitoring: configurable via env vars (PROMETHEUS_ENDPOINT, etc.)
 * capabilities: CRD existence checks via API discovery
 * templates: ConfigMap with label opendatahub.io/template-type=serving-runtime
 */
