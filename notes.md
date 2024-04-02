# Blazor app from blazor train youtube

# Tim Corey and John tilton are useful 

# Notes for Learning DEVOPS
## Web
- `my-file.html` is better than `my_file.html` cuz Google Search engine treats `-` as a word separator instead of `_`!

## Reactive Extensions
-

## Dependency injection
- `AddTransient<DemoLogic>` each time it produces a new instance. 
- `AddSingleton<DemoLogic>` each tab has the same value.
- `AddScoped<DemoLogic>` each tab has its own copy of singleton.


# Blazor

- `two-way binding` is required for parent and child component communication.
- `cascading` can be used for having multiple components bounded together.
- `R.I.P.` method for the attributes protection.


## Double checks
- `Multi-threaded rendering` needs to be checked closely.

## Data binding
- `Blazor` provides a suitable way to bind data for binding the data values to the variable in the class.

## Event handling
- `MouseEventArgs` is automatically added by the Blazor runtime.
- `Javascript` runs on the client, whereas `Blazor` server app runs on the server.

### Notes for Sandvik Coromant learning training materials.  
`ActivePageProvider`:
- Add navmenu items

```{cs}
<Tile CssClass="grs-1 gcs-1 gre-end gre-end">
Some code here!
</Tile>
```
- rem and font-size

## Bobben
- Use data from the sensor to move the cursor and map onto the tile and so on.

## To check
- component lifecycle
-

## Fix CA certificate issue
- `conda config --set ssl_verify certificate.crt`
