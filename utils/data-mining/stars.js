module.exports = function(raw){
    function _toArray(sth){
        if(sth === null || sth === undefined)
            return [];

        let sthArr = sth;

        if(!Array.isArray(sth))
            sthArr = [ sth ];

        return sthArr;
    }

    let data = {
        stars: {},
        starsRadius: 0,
        planets: {},
        empires: {}
    };

    let planetToStar = {};

    Object
        .keys(raw['galactic_object'])
        .map(id => {
            let star = raw['galactic_object'][id];
            star['id'] = id;

            return star;
        })
        .forEach(o => {
            let planets = _toArray(o['planet']);

            let star = {
                id: o['id'],
                cords: {
                    x: -o['coordinate']['x'],
                    y: -o['coordinate']['y']
                },
                type: o['type'],
                name: o['name'],
                planets: planets.map(pId => `${pId}`)
            };

            const distance = Math.sqrt(Math.pow(star.cords.x, 2) + Math.pow(star.cords.y, 2));

            if(distance > data.starsRadius)
                data.starsRadius = Math.ceil(distance);

            planets
                .forEach(planetId => {
                    planetToStar[planetId] = o.name;
                });

            data.stars[`${o['id']}`] = star;
        });

    Object
        .keys(raw["planet"])
        .forEach(i => {
            const o = raw["planet"][i];

            let planet = {
                colonized: false
            };

            if(o['pop'] !== undefined){
                planet.colonized = true;
                planet.populationCount = o['pop'].length;
            }

            _toArray(o['timed_modifier']).forEach(modifier => {
                if(modifier['modifier'] === 'capital')
                    planet.capital = true;
            });

            data.planets[i] = planet;
        });

    Object
        .keys(raw["country"])
        .forEach(i => {
            const o = raw["country"][i];

            if(o["type"] === undefined)
                return;

            let empire = {
                id: `${i}`,
                name: o["name"],
                type: o["type"],
                colors: o["flag"] !== undefined ? o["flag"].colors : undefined,
                sectors: []
            };

            let controlledPlanets = {};

            if(o.type !== "primitive" && o["controlled_planets"] !== undefined) {
                o["controlled_planets"].forEach(planetId => {
                    data.planets[planetId].controlledBy = i;

                    if(data.planets[planetId].capital){
                        empire.capital = {
                            planet: `${planetId}`,
                            star: planetToStar[planetId]
                        }
                    }

                    controlledPlanets[`${planetId}`] = `${planetId}`;
                });
            }

            if(o['sectors'] !== undefined){
                const sectors = o['sectors'];

                empire.sectors = Object
                    .keys(sectors)
                    .map(id => {
                        let sector = sectors[id];
                        sector["id"] = `${id}`;

                        return sector;
                    })
                    .map(sector => {
                        return {
                            type: sector['type'] !== undefined ? "sector" : "core",
                            focus: sector['type'],
                            id: sector['id'],
                            stars: sector["galactic_object"].map(starId => `${starId}`)
                        };
                    })
                    .reduce((prev, curr) => {
                        prev[curr.id] = curr;
                        return prev;
                    }, {});

                if(empire.sectors == [])
                    console.log("DUPA");
            }

            data.empires[i] = empire;
        });

    data.stars = Object
        .keys(data.stars)
        .map(i => {
            let star = data.stars[i];

            // find who is in control of system - eq. who is in control of planets in system
            star.influencedBy = star.planets
                // map with controlled planets by empires
                .map(planetId => JSON.parse(JSON.stringify(data.planets[planetId])))
                .filter(planet => !!planet.controlledBy)
                .filter(planet => { return { controlledBy: planet.controlledBy, populationCount: planet.populationCount }; })
                .reduce((prev, planet) => {
                    let prevThis = prev.filter(prevPlanet => prevPlanet.controlledBy === planet.controlledBy);
                    const prevOthers = prev.filter(prevPlanet => prevPlanet.controlledBy !== planet.controlledBy);

                    if(prevThis.length === 0){
                        prevThis = [planet];
                    } else if(planet.colonized) {
                        prevThis[0].colonized = true;

                        if(prevThis[0].populationCount === undefined)
                            prevThis[0].populationCount = 0;

                        prevThis[0].populationCount += planet.populationCount;
                    }

                    return [].concat(prevThis, prevOthers);
                }, []);

            return star;
        })
        .reduce((prev, curr) => {
            prev[curr.id] = curr;
            return prev;
        }, {});

    return data;
};
