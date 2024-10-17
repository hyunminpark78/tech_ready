const RECOMMEND_TYPE = {
  sameType: 'SameFamily',
  priceFirst: 'PricePrior',
  stabilityFirst: 'StabilityPrior',
};

const servicesList = [
  {
    cd: 'EC2',
    nm: 'EC2',
  },
  {
    cd: 'EKS',
    nm: 'EKS',
  },
  {
    cd: 'ECS',
    nm: 'ECS',
  },
  {
    cd: 'EMR',
    nm: 'EMR',
  },
  {
    cd: 'AutoScailing',
    nm: 'Auto Scailing',
  },
  {
    cd: 'Batch',
    nm: 'Batch',
  },
];

const requestStatus = {
  pendingEvaluation: 'pendingEvaluation',
  pendingFulfillment: 'pendingFulfillment',
  fulfilled: 'fulfilled',
  markedForStop: 'markedForStop',
  markedForTermination: 'markedForTermination',
  capacityNotAvailable: 'capacityNotAvailable',
  priceTooLow: 'priceTooLow',
  notScheduledYet: 'notScheduledYet',
  launchGroupConstraint: 'launchGroupConstraint',
  azGroupConstraint: 'azGroupConstraint',
  placementGroupConstraint: 'placementGroupConstraint',
  constraintNotFulfillable: 'constraintNotFulfillable',
  instanceStoppedByUser1: 'instanceStoppedByUser1',
  scheduleExpired: 'scheduleExpired',
  canceledBeforeFulfillment: 'canceledBeforeFulfillment',
  instanceTerminatedByService: 'instanceTerminatedByService',
  requestCanceledAndInstanceRunning: 'requestCanceledAndInstanceRunning',
  badParameters: 'badParameters',
  systemError: 'systemError',
  instanceStoppedByUser2: 'instanceStoppedByUser2',
};

const usageStatus = {
  instanceTerminatedByPrice: 'instanceTerminatedByPrice',
  instanceStoppedNoCapacity: 'instanceStoppedNoCapacity',
  instanceStoppedByPrice: 'instanceStoppedByPrice',
  instanceTerminatedBySchedule: 'instanceTerminatedBySchedule',
  instanceTerminatedByUser: 'instanceTerminatedByUser',
  instanceTerminatedNoCapacity1: 'instance-terminated-no-capacity',
  instanceTerminatedNoCapacity2: 'instanceTerminatedNoCapacity2',
  instanceTerminatedLaunchGroupConstraint: 'instanceTerminatedLaunchGroupConstraint',
  fulfilled: 'fulfilled',
};

export { RECOMMEND_TYPE, servicesList, requestStatus, usageStatus };
