const isActionType = maybeValidActionType => Boolean(typeof maybeValidActionType === 'string' && maybeValidActionType.length);

export default isActionType;