class MyPromise {
    private value?: any;
    private reason?: any;
    private state: 'pending' | 'fulfilled' | 'rejected' = 'pending';
    private fulfilledCallbacks: Function[] = []; // ✅ 正确类型
    private rejectedCallbacks: Function[] = [];
}