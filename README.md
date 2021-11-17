# mpsserver-client

This library is a TypeScript client for MPSServer.

Most classes are generated from a description of the MPSServer protocol available in the MPSServer protocol.

## Generation process

Within MPS one should generate the solutions containing the protocol, i.e. instances of concept WebSocketsAPIsGroup. 
At this moment those solutions are:
* com.strumenta.mpsserver.server
* com.strumenta.mpsserver.modelix

Within those solutions, in the source_gen directory one will find XML files describing the protocol.
These files will have the name "wsprotocol_*.xml"

These files are read by the generator (generator-src/generator.ts) and used to generate code under src/gen.

The generator can be invoked in this way:

```
ts-node generator-src/generator.ts ~/repos/mpsserver
```
